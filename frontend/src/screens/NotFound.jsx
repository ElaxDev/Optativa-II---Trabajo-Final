function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-300">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-lg text-gray-600 mb-2">
        ¡Ups! Parece que la página que buscas no existe.
      </p>
    </div>
  );
}

export default NotFound;
