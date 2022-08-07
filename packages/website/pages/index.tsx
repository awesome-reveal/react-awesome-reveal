import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="wrapper">
      <Head>
        <title>React Awesome Reveal</title>
        <meta
          name="description"
          content="Add revealing animations to your website with ease"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="content">
        <h1 className="title">React Awesome Reveal</h1>
        <p className="headline">
          Documentation website is under (re)construction.
          <br />
          Please refer to the{" "}
          <a
            href="https://github.com/morellodev/react-awesome-reveal"
            target="_blank"
            rel="noopener noreferrer"
          >
            project <code>README</code>
          </a>{" "}
          for the instructions.
        </p>
      </main>

      <style jsx>
        {`
          .wrapper {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .content {
            padding: 4rem 0;
          }

          .title {
            text-align: center;
          }

          .headline {
            text-align: center;
          }

          @media (min-width: 800px) {
            .content {
              padding: 8rem 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
