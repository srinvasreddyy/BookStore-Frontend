import React from "react";

const CATEGORIES = [
  {
    name: "Classic",
    slug: "classic",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Romance",
    slug: "romance",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Thriller",
    slug: "thriller",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    image:
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "GK",
    slug: "gk",
    image:
      "https://images.unsplash.com/photo-1695774165691-8a01a6045952?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
 
];

const CategoryCards = () => {
  return (
    <div className="w-full  max-w-7xl h-fit mx-auto px-4 sm:px-6 py-14 max-lg:py-8  lg:px-8 ">
      <div>
        <p className="font-bold text-neutral-500 max-lg:text-[9px] uppercase text-xs">
          Discover
        </p>
        <h2 className="text-2xl max-lg:text-lg font-bold mb-4">
          Shop By Categories
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {CATEGORIES.map((category) => {
          return (
            <div
              key={category.slug}
              className="relative h-60 max-lg:h-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />

              {/* bottom panel with name and Order Now button */}
              <div className="absolute bottom-0 left-0 right-0 bg-white px-3 py-3 flex flex-col items-center gap-2">
                <div className="text-sm font-semibold text-black">{category.name}</div>
                <button className="text-xs bg-black text-white w-full py-2 font-semibold rounded-md hover:bg-neutral-800 transition">
                  Order Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCards;
