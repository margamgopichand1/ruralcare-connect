import { MedicineItem } from '../types';
import { mockMedicines } from '../data/mockData';

const MEDICINES_STORAGE_KEY = 'ruralcare_medicines';

export function getAllMedicines(): MedicineItem[] {
  try {
    const data = localStorage.getItem(MEDICINES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load medicines from localStorage', e);
  }
  return mockMedicines;
}

export function searchMedicines(query: string, categoryFilter?: string): MedicineItem[] {
  const list = getAllMedicines();
  const q = query.trim().toLowerCase();

  return list.filter((item) => {
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.genericName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesCategory =
      !categoryFilter || categoryFilter === 'all' || item.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesQuery && matchesCategory;
  });
}

export function deductMedicineStock(medicineName: string, facilityId: string, qty: number): void {
  const list = getAllMedicines();
  let updated = false;

  for (const item of list) {
    if (item.name.toLowerCase().includes(medicineName.toLowerCase())) {
      for (const stock of item.stocks) {
        if (stock.facilityId === facilityId) {
          stock.quantity = Math.max(0, stock.quantity - qty);
          if (stock.quantity === 0) stock.status = 'out_of_stock';
          else if (stock.quantity < 20) stock.status = 'low_stock';
          updated = true;
        }
      }
    }
  }

  if (updated) {
    try {
      localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving updated medicines', e);
    }
  }
}
