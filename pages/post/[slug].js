import { GraphQLClient } from "graphql-request";
import Link from "next/link";
import IndexNavbar from '../../components/Navbars/IndexNavbar';
const graphcms = new GraphQLClient(process.env.GRAPHQL_URL_ENDPOINT);

export async function getStaticProps({ params }) {
  const { post } = await graphcms.request(
    `
    query Post($slug: String!) {
      post(where: { slug: $slug }) {
        id
        title
        content{
          text
        }
        slug
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
  `,
    {
      slug: params.slug,
    }
  );

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const { posts } = await graphcms.request(`
    {
      posts {
        id
        title
        content{
          text
        }
        slug
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
  `);

  return {
    paths: posts.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: false,
  };
}

const PostPage = ({ post }) => {
  return (
    <div className="py-16">
      <IndexNavbar fixed />
      <div>
        <img className="h-96 w-full" src={post.coverImage.url} />
      </div>
      <div className="max-w-4xl rounded-lg mx-auto mb-16">
        <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-2xl mt-4 mb-4">
              {post.title}
            </div>
            <div>
              <p>{post.date}</p>
              <p>{post.author.name}</p>
              <hr className="border border-gray-50 my-10"></hr>

            </div>
            <p className="text-gray-700 text-base">{post.content.text}</p>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{post.author.name}</p>
              <p className="text-gray-600">{post.date}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <a>Back to all posts</a>
        </Link>
      </div>
    </div>
  );
};


export default PostPage;