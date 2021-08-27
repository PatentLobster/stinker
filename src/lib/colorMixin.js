export const colorMixin = {
    methods: {
        getLightBGColor(color) {
            // Made for postcss & tailwind
            switch (color) {
                case "green":
                    return "bg-green-100";
                case "blue":
                    return "bg-blue-100";
                case "yellow":
                    return "bg-yellow-100";
                case "cyan":
                    return "bg-cyan-100";
                case "pink":
                    return "bg-pink-100";
                case "purple":
                    return "bg-purple-100";
                case "indigo":
                    return "bg-indigo-100";
                case "gray":
                    return "bg-gray-100";
                case "red":
                    return "bg-red-100";
                case "teal":
                    return "bg-teal-100";
                default:
                    return color;
            }
        },
        getBGColor(color) {
            // Made for postcss & tailwind
            switch (color) {
                case "green":
                    return "bg-green-600";
                case "blue":
                    return "bg-blue-600";
                case "yellow":
                    return "bg-yellow-600";
                case "cyan":
                    return "bg-cyan-600";
                case "pink":
                    return "bg-pink-600";
                case "purple":
                    return "bg-purple-600";
                case "indigo":
                    return "bg-indigo-600";
                case "gray":
                    return "bg-gray-600";
                case "red":
                    return "bg-red-600";
                case "teal":
                    return "bg-teal-600";
                default:
                    return color;
            }
        },
        getIconColor(color) {
            switch (color) {
                case "green":
                    return "text-green-600";
                case "blue":
                    return "text-blue-600";
                case "yellow":
                    return "text-yellow-600";
                case "cyan":
                    return "text-cyan-600";
                case "pink":
                    return "text-pink-600";
                case "purple":
                    return "text-purple-600";
                case "indigo":
                    return "text-indigo-600";
                case "gray":
                    return "text-gray-600";
                case "red":
                    return "text-red-600";
                case "teal":
                    return "text-teal-600";
                default:
                    return color;
            }
        }
    }
}