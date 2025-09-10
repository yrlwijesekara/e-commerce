export default function ProductCard(props) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-shadow p-6 m-4 rounded-xl flex flex-col items-center border border-gray-200">
      <h1 className="text-xl font-bold text-gray-800 mb-2">{props.name}</h1>
      <p className="text-lg text-gray-600 mb-4">Price: <span className="font-semibold text-green-600">${props.price}</span></p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
        Add to Cart
      </button>
    </div>
  );
}