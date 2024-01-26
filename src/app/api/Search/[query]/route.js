import {NextResponse} from "next/server";
const algoliasearch = require('algoliasearch')

// export const dynamic = "force-dynamic";
export async function GET(req, {params}) {
    try {
        let queryString = params.query.replace("-", " ");
        const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
        const index = client.initIndex('Products');
        const searchResult = await new Promise((resolve, reject) => {
            index.search(queryString).then(({hits}) => {
                resolve(hits);
            });
        });
        return NextResponse.json({data: searchResult, status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({status: 500, error})
    }
}