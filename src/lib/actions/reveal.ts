export function reveal(node: HTMLElement, { delay = 0, y = 20 } = {}) {
	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.style.opacity = '1';
				node.style.transform = 'translateY(0)';
				observer.disconnect();
			}
		},
		{ threshold: 0.15 }
	);

	observer.observe(node);
	return { destroy: () => observer.disconnect() };
}