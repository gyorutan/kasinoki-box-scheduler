<script>
	import { page } from '$app/stores';
</script>

<div class="max-w-[768px] min-w-[375px] m-auto flex fixed w-full bottom-0 bg-slate-100 border-t border-slate-200">
	<a
		href="/"
		class={$page.url.pathname === '/'
			? 'w-full text-center bg-slate-600 text-white font-bold p-2'
			: 'w-full text-center p-2 font-bold'}>予約状況</a
	>
	<a
		href="/reserve"
		class={$page.url.pathname === '/reserve'
			? 'w-full text-center bg-slate-600 text-white font-bold p-2'
			: 'w-full text-center font-bold p-2'}>予約する</a
	>
</div>
