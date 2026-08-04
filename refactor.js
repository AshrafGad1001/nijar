const fs = require('fs');
const path = require('path');

const replacements = [
  { match: /MenuItem/g, replace: 'Product' },
  { match: /menuItem/g, replace: 'product' },
  { match: /menuItems/g, replace: 'products' },
  { match: /MenuNavbar/g, replace: 'CatalogNavbar' },
  { match: /MenuStickyTabs/g, replace: 'CatalogTabs' },
  { match: /MenuCategory/g, replace: 'CatalogCategory' },
  { match: /MenuItemForm/g, replace: 'ProductForm' },
  { match: /'\/menu'/g, replace: "'/catalog'" },
  { match: /"\/menu"/g, replace: '"/catalog"' },
  { match: /\/api\/v1\/menu/g, replace: '/api/v1/catalog' },
  { match: /\/api\/v1\/items/g, replace: '/api/v1/products' },
  { match: /\/items\//g, replace: '/products/' },
  { match: /'\/items/g, replace: "'/products" },
  { match: /المنيو/g, replace: 'الكتالوج' }
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.match, r.replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', filePath);
  }
}

function processDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        processDir(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.css')) {
      replaceInFile(filePath);
    }
  });
}

processDir(path.join(process.cwd(), 'src'));
