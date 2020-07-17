/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint-disable camelcase */
import {
  fetchLitDataset,
  getDatetimeOne,
  getDecimalOne,
  getIntegerOne,
  getIriAll,
  getIriOne,
  getStringUnlocalizedOne,
  getThingOne,
  Iri,
  iriAsString,
  IriString,
  LitDataset,
  stringAsIri,
  Thing,
  unstable_Access,
  unstable_AgentAccess,
  unstable_fetchFile,
  unstable_fetchLitDatasetWithAcl,
  unstable_getAgentAccessAll,
} from "@solid/lit-pod";
import { RDF, FOAF, VCARD, DCTERMS, POSIX, LDP } from "@solid/lit-vocab-common";
import { WS } from "@solid/lit-vocab-solid";
import { getLocalStore, LitTermRegistry } from "@solid/lit-term";
import { parseUrl } from "../stringHelpers";

export function getIriPath(iri: Iri): string | undefined {
  const { pathname } = parseUrl(iri);
  return pathname.replace(/\/?$/, "");
}

export function displayPermissions(permissions: unstable_Access): string {
  const perms = Object.values(permissions);
  if (perms.every((p) => p)) return "Full Control";
  if (perms.every((p) => !p)) return "No Access";
  if (permissions.write) return "Can Edit";
  return "Can View";
}

export interface Profile {
  webId: Iri;
  avatar?: Iri | null;
  // PMCB55: Using 'string' here is still dangerous, as opposed to a Literal
  // object (or even an extension of that to include text-direction)) in case
  // the UI wants knowledge of the i18n-ness of these values.
  name?: string | null;
  nickname?: string | null;
  pods?: Iri[] | null;
}

export async function fetchProfile(webId: Iri): Promise<Profile> {
  const profileResource = await fetchLitDataset(webId);
  const profile = getThingOne(profileResource, webId);
  const nickname = getStringUnlocalizedOne(profile, FOAF.nick);
  const name = getStringUnlocalizedOne(profile, FOAF.name);
  const avatar = getIriOne(profile, VCARD.hasPhoto);
  const pods = getIriAll(profile, WS.storage);

  return { webId, nickname, name, avatar, pods };
}

export interface NormalizedPermission {
  webId: Iri;
  alias: string;
  acl: unstable_Access;
  profile: Profile;
}

export async function normalizePermissions(
  permissions: unstable_AgentAccess,
  fetchProfileFn = fetchProfile
): Promise<NormalizedPermission[]> {
  return Promise.all(
    Object.keys(permissions).map(
      // PMCB55: Yes indeed, since we're using a Record<string, ...> here where
      // the 'key' is actually a WebID (which, by definition, *MUST* be an
      // IRI!), we need to treat WebID's as strings here (and then convert to
      // proper IRIs when passing them on).
      async (webIdAsString: string): Promise<NormalizedPermission> => {
        const acl = permissions[webIdAsString];
        const profile = await fetchProfileFn(stringAsIri(webIdAsString));

        return {
          acl,
          profile,
          alias: displayPermissions(acl),
          webId: stringAsIri(webIdAsString),
        };
      }
    )
  );
}

export function normalizeDataset(
  dataset: Thing,
  iri: IriString
): NormalizedResource {
  const rawType = getIriAll(dataset, RDF.type);

  const mtime = getDecimalOne(dataset, POSIX.mtime);
  const modified = getDatetimeOne(dataset, DCTERMS.modified);
  const size = getIntegerOne(dataset, POSIX.size);
  const contains = getIriAll(dataset, LDP.contains);

  // PMCB55: We actually want the rdfs:label for each 'Type', if available -
  // for this we can just lookup the LIT Vocab Term registry...
  const termRegistry = new LitTermRegistry(getLocalStore());
  const typeLabels = rawType.map((typeIri) => {
    const result = termRegistry.lookupLabel(iriAsString(typeIri), "en");
    return result === undefined ? iriAsString(typeIri) : result;
  });

  return {
    contains,
    iri,
    modified,
    mtime,
    size,
    types: typeLabels,
  };
}

export interface NormalizedResource {
  iri: Iri;
  types: string[];
  mtime?: number | null;
  modified?: Date | null;
  size?: number | null;
  contains?: Iri[];
  permissions?: NormalizedPermission[];
}

export interface ResourceDetails extends NormalizedResource {
  name: string;
}

export const PERMISSIONS: string[] = ["read", "write", "append", "control"];

export function parseStringAcl(acl: string): unstable_Access {
  return PERMISSIONS.reduce((acc, key) => {
    return {
      ...acc,
      [key]: acl.includes(key),
    };
  }, {} as unstable_Access);
}

export function permissionsFromWacAllowHeaders(
  wacAllow?: string
): NormalizedPermission[] {
  if (!wacAllow) return [];

  const permissions = wacAllow.split(",");

  return permissions.reduce(
    (acc: NormalizedPermission[], permission: string) => {
      const [webIdAsString, stringAcl] = permission.split("=");
      const webId = stringAsIri(webIdAsString);

      const acl = parseStringAcl(stringAcl);
      const alias = displayPermissions(acl);

      return [
        ...acc,
        {
          webId,
          alias,
          acl,
          profile: { webId, name: iriAsString(webId) },
        },
      ];
    },
    []
  );
}

export interface NormalizedFile extends NormalizedResource {
  file: Blob;
}

export async function fetchFileWithAcl(iri: Iri): Promise<NormalizedFile> {
  const file = await unstable_fetchFile(iriAsString(iri));
  const {
    resourceInfo: { unstable_permissions, contentType: type },
  } = file;

  const permissions = unstable_permissions
    ? [
        {
          webId: stringAsIri("user"),
          alias: displayPermissions(unstable_permissions.user),
          profile: { webId: stringAsIri("user") },
          acl: unstable_permissions?.user as unstable_Access,
        } as NormalizedPermission,
        {
          webId: stringAsIri("public"),
          alias: displayPermissions(unstable_permissions.public),
          profile: { webId: stringAsIri("public") },
          acl: unstable_permissions?.public as unstable_Access,
        } as NormalizedPermission,
      ]
    : [];
  const types = type ? [type] : [];

  return {
    iri,
    permissions,
    types,
    file,
  };
}

export async function fetchResourceWithAcl(
  iri: Iri,
  normalizePermissionsFn = normalizePermissions
): Promise<NormalizedResource> {
  const resource = await unstable_fetchLitDatasetWithAcl(iri);
  const acl = await unstable_getAgentAccessAll(resource);
  const permissions = acl ? await normalizePermissionsFn(acl) : undefined;
  const dataset = resource as LitDataset;
  const thing = dataset as Thing;

  return {
    permissions,
    ...normalizeDataset(thing, iri),
  };
}

export async function fetchResource(
  iri: Iri,
  normalizeDatasetFn = normalizeDataset
): Promise<NormalizedResource> {
  const resource = await fetchLitDataset(iri);
  const dataset = resource as LitDataset;
  const thing = dataset as Thing;

  return normalizeDatasetFn(thing, iri);
}

export function isUserOrMatch(webId: Iri, id: Iri): boolean {
  return webId.equals(stringAsIri("user")) || webId.equals(id);
}

export function getUserPermissions(
  id: Iri,
  permissions?: NormalizedPermission[]
): NormalizedPermission | null {
  if (!permissions) return null;

  const permission = permissions.find(({ webId }) => isUserOrMatch(webId, id));

  return permission || null;
}

export function getThirdPartyPermissions(
  id: Iri,
  permissions?: NormalizedPermission[]
): NormalizedPermission[] {
  if (!permissions) return [];
  return permissions.filter(({ webId }) => !isUserOrMatch(webId, id));
}
