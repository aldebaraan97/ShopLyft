export default function Footer() {
    return (
        <footer className="w-full bg-gray-100 shadow-inner p-4 flex flex-col items-center gap-2 mt-8">
            <p className="text-gray-700 text-sm">&copy; {new Date().getFullYear()} ShopLyft. All rights reserved.</p>
            <p className="text-gray-500 text-xs">Powered by React & Spring Boot</p>
        </footer>
    );
}
