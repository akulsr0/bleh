import Head from "next/head";

const defaultMetaDescription = "Wecome to Bleh";

const Header = ({ title, metaDescription = defaultMetaDescription }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <meta name="description" content={metaDescription} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Header;
