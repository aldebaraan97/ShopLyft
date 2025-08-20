import { Link } from "react-router-dom";
import { Search, User, ShoppingCart } from "lucide-react";

export default function Header() {
    return (
        <header className="w-full bg-gray-100 shadow-md p-4 flex flex-col items-center gap-4">
            {/* Title */}
            <h1 className="text-2xl font-bold">ShopLyft</h1>

            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border rounded-xl py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center gap-3">
                <Link
                    to="/products"
                    className="text-blue-600 hover:underline"
                >
                    Products
                </Link>
                <Link
                    to="/products/new"
                    className="text-blue-600 hover:underline"
                >
                    Form
                </Link>
            </nav>

            {/* Icons Row */}
            <div className="flex gap-6 mt-2">
                <User className="cursor-pointer text-gray-700 hover:text-blue-500" size={24} />
                <Link to="/cart">
                    <ShoppingCart className="cursor-pointer text-gray-700 hover:text-blue-500" size={24} />
                </Link>
            </div>
        </header>
    );
}
