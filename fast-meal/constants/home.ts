export const quickFilterOptions = [
	"quick",
	"highProtein",
	"glutenFree",
	"vegetarian",
	"vegan",
	"breakfast",
	"lunch",
	"dessert",
] as const;

export type QuickFilterOption = (typeof quickFilterOptions)[number];
