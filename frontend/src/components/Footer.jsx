import HomeIcon from '@mui/icons-material/Home';
import ContactMailIcon from '@mui/icons-material/ContactMail';

export default function Footer() {
    return (
        <footer className="w-full bg-gray-100 shadow-inner p-4 flex flex-col items-center gap-2 mt-8">
            <div className="flex gap-4">
                <HomeIcon className="text-gray-700 hover:text-blue-500 cursor-pointer" />
                <ContactMailIcon className="text-gray-700 hover:text-blue-500 cursor-pointer" />
            </div>
            <p className="text-gray-700 text-sm">&copy; {new Date().getFullYear()} ShopLyft. All rights reserved.</p>
            <p className="text-gray-500 text-xs">Powered by React & Spring Boot</p>
        </footer>
    );
}
