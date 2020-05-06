import Link from 'next/link';
import HelloWorld from '../../components/helloWorld';

export default function Home() {
  return (
    <>
      <HelloWorld />
      <Link href="/login">
        <a>Go to login</a>
      </Link>
    </>
  );
}
