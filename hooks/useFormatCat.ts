// /* eslint-disable prettier/prettier */
// import { useMemo } from "react";
// import { Cats, CatType } from "~/type";

// export function useFormattedData(cat: CatType[] | null) {
//   return useMemo(() => {
//     if (!cat) return { categories: [], subCategories: [] };

//     const formattedData: Cats[] = Object.values(
//       cat.reduce((acc: any, curr) => {
//         if (!acc[curr.category]) {
//           acc[curr.category] = {
//             category: curr.category,
//             subcategories: [],
//           };
//         }
//         acc[curr.category].subcategories.push(curr.subcategory);
//         return acc;
//       }, {})
//     );

//     const categories = formattedData.map((c) => ({
//       value: c.category,
//       label: c.category,
//     }));

//     const subCategories = (valueCat: string) =>
//       formattedData
//         .find((c) => c.category === valueCat)
//         ?.subcategories.map((sub) => ({
//           value: sub,
//           label: sub,
//         })) || [];

//     return { categories, subCategories };
//   }, [cat]);
// }
