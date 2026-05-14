export const formatApiErrorBody = (status: number, text: string): string => {
	const isHtml = text.includes("<!DOCTYPE") || text.includes("<html");
	const preview = isHtml || text.length > 240 ? `${text.slice(0, 160)}…` : text;

	if (status === 404 && isHtml) {
		return `${preview}`;
	}

	return preview;
};
