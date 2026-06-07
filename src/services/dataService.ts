import Papa from 'papaparse';

export interface Gallery {
  name: string;
  district: string;
  address: string;
  phone: string;
  workingHours: string;
  image: string;
  coords: { lat: number; lng: number } | null;
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1KQACBO1NjXE4E3ohqAfa-I21gx5h8nup4H0UaUqVT0A/export?format=csv';

export async function fetchGalleries(): Promise<Gallery[]> {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvContent = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const galleries: Gallery[] = results.data.map((row: any) => {
            const name = row['Galeri Adı'] || '';
            const district = row['İlçe Adı'] || '';
            const address = row['Adres'] || '';
            const phone = row['Telefon'] || '';
            const workingHours = row['Çalışma Saatleri'] || '';
            const image = row['Görsel'] || '';
            
            const coordsStr = row['Kordinatlar'] || '';
            let coords = null;
            if (coordsStr && coordsStr.includes(',')) {
              const parts = coordsStr.split(',');
              const lat = parseFloat(parts[0].trim());
              const lng = parseFloat(parts[1].trim());
              if (!isNaN(lat) && !isNaN(lng)) {
                coords = { lat, lng };
              }
            }
            
            return {
              name,
              district,
              address,
              phone,
              workingHours,
              image,
              coords
            };
          });
          resolve(galleries);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (err) {
    console.error("Failed to fetch Google Sheets CSV", err);
    return [];
  }
}
