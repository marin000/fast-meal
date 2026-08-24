import { OPEN_FOOD_FACTS_FETCH_TIMEOUT_MS } from '@/constants/open-food-facts';
import type { BarcodeProduct, BarcodeProductDetails, BarcodeProductEssentials } from '@/interface/barcode-product';
import { formatApiErrorBody } from '@/utils/api-error-text';
import { buildBarcodeProductReportBody } from '@/utils/food-facts-helper';

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/barcode-products`;

type FetchBarcodeResult = { found: true; product: BarcodeProduct } | { found: false };

const fetchWithTimeout = async (url: string, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPEN_FOOD_FACTS_FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

export const fetchBarcodeProduct = async (
  deviceId: string,
  code: string,
  includeDetails = false,
): Promise<FetchBarcodeResult> => {
  const params = new URLSearchParams({
    deviceId,
    code,
    ...(includeDetails ? { include: 'details' } : {}),
  });

  const response = await fetchWithTimeout(`${apiEndpoint}?${params.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to load barcode product (${response.status}): ${formatApiErrorBody(response.status, text)}`,
    );
  }

  const data = (await response.json()) as FetchBarcodeResult;
  return data;
};

export const reportBarcodeProduct = async (params: {
  deviceId: string;
  essentials: BarcodeProductEssentials;
  details?: BarcodeProductDetails;
}): Promise<BarcodeProduct> => {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildBarcodeProductReportBody(params)),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Report barcode product failed (${response.status}): ${formatApiErrorBody(response.status, text)}`);
  }

  return (await response.json()) as BarcodeProduct;
};
