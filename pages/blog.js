import { GraphQLClient } from "graphql-request";
import Link from "next/link";
import IndexNavbar from "../components/Navbars/IndexNavbar.js";
const graphcms = new GraphQLClient(process.env.GRAPHQL_URL_ENDPOINT);

export async function getStaticProps() {
  const { posts } = await graphcms.request(
    `
    query Posts() {
      posts {
        id
        title
        excerpt
        slug
        tags
        ratings
        category {
          id
          categoryName
          categoryUrl
          }
        coverImage {
          id
          url
        }
        author {
          id
          name
        }
        date
      }
    }
  `
  );
  const { categories } = await graphcms.request(
    `
    query categories() {
      categories {
        id
        categoryName
        categoryUrl
      }
    }
  `
  );

  return {
    props: {
      posts,
      categories,
    },
  };
}

const blog = ({ posts, categories }) => {
  return (

    <div className="md:flex">
    <div className=" mt-20 md:w-9/12">
        <IndexNavbar fixed />

        <div className=" px-4 font-semibold py-8 text-4xl">
          <h1> BigRadar Blog</h1>
        </div>
      {posts.map((post) => {
        return (
          <Link key={post.id} as={`/post/${post.slug}`} href="/post/[slug]">
            <div className="px-4 cursor-pointer">
              <div className="hover:shadow-md p-4 hover:p-6 hover:bg-gray-50 duration-200">
                <img className="rounded md:w-9/12 xl:w-8/12" src={post.coverImage.url} />
                <div className="text-xl md:text-2xl font-semibold mt-4 ">
                  <h1>{post.title}</h1>
                </div>
                <div className="text-sm mt-2 text-gray-600">
                  <p>{post.date}</p>
                </div>
                <div className="text-md mt-2 text-gray-600">
                  <p>{post.excerpt}</p>
                </div>
                <div className="text-md mt-2 text-blue">
                  <p>{post.author.name}</p>
                </div>
                <div className="text-md mt-2 text-blue">
                  <p>{post.ratings} <i class="fas fa-star"></i></p>
                </div>
              </div>
              <hr className="border border-gray-50 my-10"></hr>
            </div>

          </Link>
        );
      })}
    </div>

    <div className="bg-gray-50 md:w-3/12 px-4">
      <h1 className="mt-20 text-2xl pt-10 pb-6">Categories</h1>
      {categories && categories.map((category) => {
        return(
          <>
          {/* <Link key={category.id} as={`/category/${category.categoryUrl}`} href="/category/[categoryUrl]"> */}
            <div className="rounded-full p-2 text-center w-10/12 bg-black text-white my-4">
              <p className="text-sm">{category.categoryName}</p>
            </div>
          {/* </Link> */}
          </>
        )
      })}
    </div>
    </div>
  );
};

export default blog;