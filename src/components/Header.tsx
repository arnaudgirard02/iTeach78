import React from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">iTeach</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Tarifs
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Témoignages
            </a>
            {user ? (
              <Link 
                to="/dashboard"
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Tableau de bord
              </Link>
            ) : (
              <button 
                onClick={handleStart}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Commencer
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 py-4">
            <div className="flex flex-col items-center gap-4">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Tarifs
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Témoignages
              </a>
              {user ? (
                <Link 
                  to="/dashboard"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Tableau de bord
                </Link>
              ) : (
                <button 
                  onClick={handleStart}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Commencer
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}