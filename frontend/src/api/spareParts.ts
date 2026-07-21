import { inventoryApi, type SparePartDto } from '@/api/inventory';

export type SearchSparePartsParams = {
  vehicleName?: string;
  search?: string;
};

export type SearchSparePartsFn = (
  params?: SearchSparePartsParams
) => Promise<SparePartDto[]>;

declare global {
  interface Window {
    __MECH_SEARCH_SPARE_PARTS__?: SearchSparePartsFn;
  }
}

/**
 * In SPFx embed: SharePoint REST via window.__MECH_SEARCH_SPARE_PARTS__.
 * Local Vite: backend GET /api/dictionaries/spare-parts.
 */
export async function searchSpareParts(
  params?: SearchSparePartsParams
): Promise<SparePartDto[]> {
  if (typeof window.__MECH_SEARCH_SPARE_PARTS__ === 'function') {
    return window.__MECH_SEARCH_SPARE_PARTS__(params);
  }
  return inventoryApi.searchSpareParts(params);
}
