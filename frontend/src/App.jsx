
import './App.css'
import ProductCard from './components/productCard'
function App() {
  

  return (
    <>
      <div>
         <ProductCard 
         name = "samsung galaxy"
         price = "100"
         />
         <ProductCard 
         name = "Apple iPhone"
         price = "500"
         />
      </div>
    </>
  )
}

export default App
