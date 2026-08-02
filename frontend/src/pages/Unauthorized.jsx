import { Link } from "react-router-dom";

const Unauthorized = () => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-10 text-center">

                <h1 className="text-6xl font-bold text-red-600">
                    403
                </h1>

                <h2 className="text-2xl font-semibold mt-4">
                    Access Denied
                </h2>

                <p className="text-gray-500 mt-2">
                    This page is restricted to administrators only.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-block bg-teal-600 text-white px-6 py-2 rounded"
                >
                    Go Back
                </Link>

            </div>
        </div>
    );
};

export default Unauthorized;