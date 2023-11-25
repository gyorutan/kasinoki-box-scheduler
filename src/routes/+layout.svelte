<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';
	// import { SvelteToast } from '@zerodevx/svelte-toast';

	// const options = {
	// 	duration: 3000,
	// 	theme: {
	// 		'--toastBarHeight': 0,
	// 		'--toastColor': 'mintcream',
	// 		'--toastBackground': 'rgba(255, 22, 38, 0.9)',
	// 	}
	// };
</script>

<!-- <SvelteToast {options} /> -->
<div class="layout max-w-[768px] min-w-[375px] min-h-screen m-auto">
	<Navbar />
	<main class="py-[40px]"><slot /></main>
	<Footer />
</div>
