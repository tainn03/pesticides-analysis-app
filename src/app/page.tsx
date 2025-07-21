"use client";

import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/analyze');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Pesticides Diseases App</h1>
      <p className="text-lg text-gray-700 mb-8">
        Identify and learn about diseases caused by pesticides. Stay informed and protect your health.
      </p>
      <button onClick={handleNavigation} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 hover:cursor-pointer transition">
        Get Started
      </button>
    </div>
  )
}

export default App