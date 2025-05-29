import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import { FixedSizeList as List } from 'react-window';

const HomePage = () => {
  const { data = [], isLoading, error } = useProducts();

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      height={600}
      itemCount={data.length}
      itemSize={120}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ProductCard product={data[index]} />
        </div>
      )}
    </List>
  );
};

export default HomePage;
