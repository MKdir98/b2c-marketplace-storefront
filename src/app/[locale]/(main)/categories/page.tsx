import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/atoms";
import { AlgoliaProductsListing, ProductListing } from "@/components/sections";
import { ElasticsearchProductsListing } from "@/components/sections/ProductListing/ElasticsearchProductsListing";
import { getRegion } from "@/lib/data/regions";
import isBot from "@/lib/helpers/isBot";

const ALGOLIA_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID;
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

async function AllCategories({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// const bot = isBot(navigator.userAgent)
	const bot = false;

	const breadcrumbsItems = [
		{
			path: "/",
			label: "All Products",
		},
	];

	const currency_code = (await getRegion(locale))?.currency_code || "usd";

	return (
		<main className="container">
			<div className="hidden md:block mb-2">
				<Breadcrumbs items={breadcrumbsItems} />
			</div>

			<h1 className="heading-xl uppercase">All Products</h1>

			<Suspense fallback={<ProductListingSkeleton />}>
				<ElasticsearchProductsListing
					locale={locale}
					currency_code={currency_code}
				/>
			</Suspense>
		</main>
	);
}

export default AllCategories;
