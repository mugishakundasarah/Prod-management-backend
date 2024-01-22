describe('Product API', () => {
  describe('Creating products', () => {
    test('Creates a product successfully', async () => {
      const productData = { name: 'New Product', price: 19.99 };
      const response = await fetch('/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
  
      expect(response.status).toBe(201); 
      const createdProduct = await response.json();
      expect(createdProduct.name).toBe(productData.name);
      expect(createdProduct.price).toBe(productData.price);
    });
  });

  describe('Retrieving products', () => {
    test('Gets all products paginated', async () => {
      const response = await fetch('/product?page=2&pageSize=10');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.products).toBeInstanceOf(Array);
      expect(data.products.length).toBe(10); 
      expect(data.totalPages).toBeGreaterThan(1); // Only true if multiple pages exist
    });

    test('Gets filtered products by name', async () => {
      const response = await fetch('/product?name=Shoes');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.products).toBeInstanceOf(Array);
      expect(data.products.every(product => product.name.includes('Shoes'))).toBe(true);
    });

    test('Handles invalid page and size parameters', async () => {
      const response = await fetch('/product?page=0&pageSize=-10');
      expect(response.status).toBe(400); a
      
      const error = await response.json();
      expect(error.message).toContain('Invalid page or page size');
    });
  });

  describe('Deleting products', () => {
      test('Deletes a product successfully', async () => {
        const productId = '5f123456'; // Replace with your actual product ID
  
        const response = await fetch(`/product/${productId}`, { method: 'DELETE' });
        expect(response.status).toBe(204); // No content expected on successful deletion
      });
  
      test('Handles non-existent product ID', async () => {
        const productId = 'invalid-id';
  
        const response = await fetch(`/product/${productId}`, { method: 'DELETE' });
        expect(response.status).toBe(404); // Check expected error code
        
        const error = await response.json();
        expect(error.message).toContain('Product not found');
      });
  });

  describe('Updating products', () => {
        test('Updates an existing product', async () => {
            const productId = '5f123456'; // Replace with your actual product ID
            const updatedData = { name: 'Updated Product Name', price: 24.99 };
          
            const response = await fetch(`/product/${productId}`, {
              method: 'PUT', // You can also use PATCH depending on your API design
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
            });
          
            expect(response.status).toBe(200);
          
            const updatedProduct = await response.json();
            expect(updatedProduct.name).toBe(updatedData.name);
            expect(updatedProduct.price).toBe(updatedData.price);
        });
          
        test('Handles invalid product ID', async () => {
            const productId = 'invalid-id';
            const updatedData = { name: 'Updated Product Name' };
          
            const response = await fetch(`/product/${productId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
            });
          
            expect(response.status).toBe(404); // Check expected error code
          
            const error = await response.json();
            expect(error.message).toContain('Product not found');
        });
          
        test('Validates updated product data', async () => {
            const productId = '5f123456';
            const invalidData = { name: '' }; // Missing required field
          
            const response = await fetch(`/product/${productId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(invalidData),
            });
          
            expect(response.status).toBe(400); // Check expected error code
          
            const error = await response.json();
            expect(error.message).toContain('Invalid product data');
        });
  });
});
