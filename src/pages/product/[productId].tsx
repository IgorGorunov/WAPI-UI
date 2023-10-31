import {GetServerSidePropsContext} from "next";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {getProductByUID} from "@/services/products";
import useAuth from "@/context/authContext";
import Cookie from "js-cookie";

// export GetServerSideProps = async(ctx: GetServerSidePropsContext<ParsedUrlQuery>)=> {
//     const {params} = ctx;
//     const productIdQuery: string = params?.productID;
//
//     const productID = productIdQuery?.length ? productIdQuery[0] : productIdQuery;
//
//     const { token, setToken } = useAuth();
//     const savedToken = Cookie.get('token');
//
//     if (!token && savedToken) setToken(savedToken);
//
//     if (!productID) {
//         return {notFound: true};
//     }
//
//     const productData = await getProductByUID({uid: productID, token: token})
//
//     return {
//         props: {
//             productID,
//             productData
//         }
//     }
// }

function ProductPage() {
    const router = useRouter();

    console.log("query: ", router, router.query)
    return <div>hello! </div>
}

export default ProductPage;