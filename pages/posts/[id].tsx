import {
  GetStaticProps, // GetStaticPathsと併用したら型エラーになった
  GetStaticPaths,
  NextPage,
  // GetStaticPropsの型でエラーになったので、下記で対応した
  // https://zenn.dev/catnose99/articles/7201a6c56d3c88
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { setTimeout } from "timers/promises";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type PostProps = { id: string };

const Post: NextPage<PostProps> = (props) => {
  const { id } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <p>このページはSSGによってBuild時に生成されたページです</p>
        <p>{`/post/${id}に対応するページです`}</p>
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    {
      params: {
        id: "1",
      },
    },
    {
      params: {
        id: "2",
      },
    },
    {
      params: {
        id: "3",
      },
    },
  ];

  return { paths, fallback: true };
};

export const getStaticProps = async (context: any) => {
  const id = Array.isArray(context.params["id"])
    ? context.params["id"][0]
    : context.params["id"];
  // fallback時の挙動の検証
  await setTimeout(10000);
  return { props: { id } };
};

export default Post;
