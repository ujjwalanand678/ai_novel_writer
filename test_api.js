const fs = require('fs');
const path = require('path');

async function testCreatePersona() {
  const filePath = path.join(__dirname, 'test_novel.txt');
  if (!fs.existsSync(filePath)) {
    console.error('Test file not found');
    return;
  }

  const formData = new FormData();
  formData.append('name', 'Test Persona from Node');
  
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'text/plain' });
  formData.append('files', blob, 'test_novel.txt');

  try {
    const response = await fetch('http://localhost:3001/api/personas/create', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error during fetch:', error);
  }
}

testCreatePersona();
