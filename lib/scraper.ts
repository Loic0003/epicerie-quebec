import axios from 'axios'

export type Product = {
  name: string
  price: number
  store: string
  unit?: string
  image?: string
  validUntil?: string
}

const STORES = [
  { name: 'Maxi', flippId: '10654' },
  { name: 'Metro', flippId: '10952' },
  { name: 'IGA', flippId: '10960' },
  { name: 'Super C', flippId: '10956' },
]

export async function scrapeFlipp(query: string): Promise<Product[]> {
  const results: Product[] = []
  for (const store of STORES) {
    try {
      const res = await axios.get(`https://backflipp.wishabi.com/flipp/items/search`, {
        params: {
          locale: 'fr-ca',
          q: query,
          flyer_run_id: store.flippId
        },
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        },
        timeout: 8000
      })
      const items = res.data?.items || []
      items.slice(0, 5).forEach((item: any) => {
        if (item.current_price) {
          results.push({
            name: item.name || query,
            price: parseFloat(item.current_price),
            store: store.name,
            unit: item.unit_price_value ? `${item.unit_price_value}/${item.unit_price_measure}` : undefined,
            image: item.cutout_image_url || item.large_image_url,
            validUntil: item.valid_to
          })
        }
      })
    } catch (e) {
      console.log(`Erreur ${store.name}:`, e)
    }
  }
  return results.sort((a, b) => a.price - b.price)
}
