// components/footer.jsx
export const Footer = () => {
    return (<>
        <footer className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-6 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-center md:text-left">
                    © 2025 <span className="font-semibold">naman-chauhan-rajput</span>. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm">
                    <a href="/privacy" className="hover:underline">Privacy</a>
                    <a href="/terms" className="hover:underline">Terms</a>
                    <a href="/contact" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>

    </>

    );
};
