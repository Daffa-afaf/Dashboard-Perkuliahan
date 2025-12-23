import { useDarkMode } from '../../../Utils/DarkModeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg 
                 bg-gray-100 dark:bg-gray-800 
                 text-gray-800 dark:text-yellow-400
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition duration-200"
      title={isDarkMode ? 'Aktifkan Light Mode' : 'Aktifkan Dark Mode'}
    >
      {isDarkMode ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a6 6 0 111.318-1.318l2.12 2.12a1 1 0 01-1.414 1.414zM15 12a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
