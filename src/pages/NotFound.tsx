import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Page Not Found - Task Budget App</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center text-indigo-600">
          <AlertCircle className="h-24 w-24" />
        </div>
        
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          404
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Oops! The page you're looking for couldn't be found.
        </p>
        <p className="mt-1 text-base text-gray-500">
          It might have been moved, deleted, or perhaps the URL is incorrect.
        </p>
        
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
