<script lang="ts">
	import { dateFormatting } from '$lib/dateFormatting';
	import { goto } from '$app/navigation';

	// 예약 정보 타입
	interface reservationData {
		name: string;
		password: string;
		selectedDate: string;
		selectedTime: string;
	}

	// 예약 정보
	let reservationData: reservationData = {
		name: '',
		password: '',
		selectedDate: '',
		selectedTime: ''
	};

	// 필요 정보 타입
	interface requiredData {
		today: Date;
		minDate: string;
		maxDate: string;
		selectedStringDate: string;
		selectedTypesDate: Date | null;
		screenNumber: number;
		availableWeekDayTimes: string[];
		availableWeekEndTimes: string[];
	}

	// 필요 정보
	let requiredData: requiredData = {
		today: new Date(),
		minDate: '',
		maxDate: '',
		selectedStringDate: '',
		selectedTypesDate: null,
		screenNumber: 1,
		availableWeekDayTimes: [],
		availableWeekEndTimes: []
	};

	// 날짜
	const handleDate = () => {
		// 사용자가 선택한 날짜를 포맷된 형식으로 저장
		// 1단계 선택한 날짜의 형식은 String임으로 String을 Date형식으로 바꿔야함
		const selectedDate = new Date(requiredData.selectedStringDate);

		requiredData.selectedTypesDate = selectedDate;

		// 2단계 Date형식의 선택된 날짜를 Formatting 해주기
		const formattedDate = dateFormatting(selectedDate);

		// 3단계 Formatting된 날짜를 데이터에 저장
		reservationData.selectedDate = formattedDate;

		// 4단계 예약 중복확인
		checkingReservation();
	};

	// 시간대
	const handleTime = (time: string) => {
		reservationData.selectedTime = time;

		console.log('FE 선택된 시간 :', reservationData.selectedTime);
	};

	// 최소 선택 날짜
	const getMinDate = () => {
		const currentYear = requiredData.today.getFullYear();
		const currentMonth = requiredData.today.getMonth() + 1;
		const currentDate = requiredData.today.getDate();

		requiredData.minDate = `${currentYear}-${currentMonth}-${currentDate}`;

		console.log('minDate :', requiredData.minDate);
	};

	// 최대 선택 날짜
	const getMaxDate = () => {
		const afterThreeWeeks = requiredData.today;

		afterThreeWeeks.setDate(requiredData.today.getDate() + 21);

		const afterThreeWeeksYear = afterThreeWeeks.getFullYear();
		const afterThreeWeeksMonth = afterThreeWeeks.getMonth() + 1;
		const afterThreeWeeksDate = afterThreeWeeks.getDate();

		requiredData.maxDate = `${afterThreeWeeksYear}-${afterThreeWeeksMonth}-${afterThreeWeeksDate}`;

		console.log('maxDate :', requiredData.maxDate);
	};

	// 날짜 초기화
	const resetDate = () => {
		requiredData.today = new Date();
	};

	// 다음 버튼
	const handleNextScreen = () => {
		requiredData.screenNumber++;
		console.log(requiredData.screenNumber);
	};

	// 이전 버튼
	const handleBeforeScreen = () => {
		requiredData.screenNumber--;
		console.log(requiredData.screenNumber);
	};

	// 예약 중복확인
	const checkingReservation = async () => {
		try {
			const response = await fetch('/api/reserve/check', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(reservationData.selectedDate)
			});

			const resultData = await response.json();

			console.log('resultData :', resultData);

			if (resultData.success) {
				requiredData.availableWeekDayTimes = resultData.availableTimes.availableWeekDayTimes;
				requiredData.availableWeekEndTimes = resultData.availableTimes.availableWeekEndTimes;

				console.log('FE 평일 예약 가능 시간 :', requiredData.availableWeekDayTimes);
				console.log('FE 주말 예약 가능 시간 :', requiredData.availableWeekEndTimes);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// 예약하기
	const handleSubmit = async () => {
		try {
			const response = await fetch('/api/reserve', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(reservationData)
			});

			const resultData = await response.json();

			console.log(resultData);

			if (resultData.success) {
				alert('予約しました！');
				goto('/');
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="h-[88vh] flex flex-col gap-10 justify-center items-center">
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col">
		<!-- 예약 작성 1번 화면 -->
		{#if requiredData.screenNumber === 1}
			<div class="flex flex-col justify-center items-center gap-4">
				<div class="relative w-full">
					<label for="name" class="absolute left-3 top-2 font-base text-black text-sm">
						名前 / バンド名
					</label>
					<input
						bind:value={reservationData.name}
						name="name"
						required
						type="text"
						class="hover:border-slate-400 rounded-md transition bg-white border border-slate-300 focus:border-blue-600 w-full outline-none pt-9 pb-3 px-3 text-lg font-bold"
					/>
				</div>
				<div class="w-full">
					<button
						on:click={() => {
							if (reservationData.name === '') {
								alert('名前 / バンド名を入力してください！');
								return;
							}
							handleNextScreen();
							resetDate();
							getMinDate();
							getMaxDate();

							// name 값 확인
							console.log('name :', reservationData.name);
						}}
						type="button"
						class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
					>
						次へ
					</button>
				</div>
			</div>
			<!-- 예약 작성 2번 화면 -->
		{:else if requiredData.screenNumber === 2}
			<div class="flex flex-col justify-center items-center gap-4">
				<span class="text-xl font-black">
					次のライブは <span class="text-blue-600">「12月 3日」</span>です。
				</span>
				<div class="">
					<p class="text-sm">✅ 2時間以上予約する場合は、1時間ずつ予約してください！</p>
					<p class="text-sm">✅ 他のバンドのために、過度な予約はご遠慮ください！</p>
				</div>
				<div class="relative w-full">
					<label for="name" class="absolute left-3 top-2 font-base text-black text-sm">
						日付指定
					</label>
					<input
						bind:value={requiredData.selectedStringDate}
						on:change={handleDate}
						name="date"
						required
						type="date"
						min={requiredData.minDate}
						max={requiredData.maxDate}
						class="hover:border-slate-400 transition rounded-md bg-white border border-slate-300 focus:border-slate-900 w-full outline-none pt-9 pb-3 px-3 text-base font-medium"
					/>
				</div>
				<div class="flex gap-3 w-full">
					<button
						on:click={() => {
							handleBeforeScreen();
						}}
						type="button"
						class="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-5 rounded-md"
					>
						前へ
					</button>
					<button
						on:click={() => {
							if (reservationData.selectedDate === null) {
								alert('日付を指定してください！');
								return;
							}
							handleNextScreen();
						}}
						type="button"
						class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
					>
						次へ
					</button>
				</div>
			</div>
			<!-- 예약 작성 3번 화면 -->
		{:else if requiredData.screenNumber === 3}
			<div class="flex flex-col justify-center items-center gap-4">
				<p class="font-bold text-lg">{reservationData.selectedDate}の予約可能時間帯</p>
				{#if requiredData.selectedTypesDate !== null && requiredData.selectedTypesDate.getDay() !== 0 && requiredData.selectedTypesDate.getDay() !== 6}
					<div class="w-full grid grid-rows-3 grid-cols-2 gap-2">
						{#each requiredData.availableWeekDayTimes as time}
							<button
								on:click={() => {
									handleTime(time);
								}}
								type="button"
								class={reservationData.selectedTime === time
									? 'w-full font-medium py-2 rounded-md text-sm transition bg-blue-500 text-white shadow-sm'
									: 'w-full font-medium py-2 rounded-md text-sm transition hover:bg-blue-500 focus:bg-blue-500 focus:text-white text-black bg-gray-200 hover:text-white shadow-sm'}
								>{time}</button
							>
						{/each}
					</div>
				{/if}
				{#if (requiredData.selectedTypesDate !== null && requiredData.selectedTypesDate.getDay() === 0) || (requiredData.selectedTypesDate !== null && requiredData.selectedTypesDate.getDay() === 6)}
					<div class="w-full grid grid-rows-6 grid-cols-2 gap-2">
						{#each requiredData.availableWeekEndTimes as time}
							<button
								on:click={() => {
									handleTime(time);
								}}
								type="button"
								class={reservationData.selectedTime === time
									? 'w-full font-medium py-2 rounded-md text-sm transition bg-blue-500 text-white shadow-sm'
									: 'w-full font-medium py-2 rounded-md text-sm transition hover:bg-blue-500 focus:bg-blue-500 focus:text-white text-black bg-gray-200 hover:text-white shadow-sm'}
								>{time}</button
							>
						{/each}
					</div>
				{/if}
				<!-- {#if requiredData.availableWeekDayTimes.length === 0 || requiredData.availableWeekEndTimes.length === 0}
						<p class="font-bold text-lg text-center text-red-500">予約可能な時間がありません!</p>
					{/if} -->
				<div class="flex gap-3 w-full">
					<button
						on:click={() => {
							handleBeforeScreen();
						}}
						type="button"
						class="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-5 rounded-md"
					>
						前へ
					</button>
					<button
						on:click={() => {
							if (reservationData.selectedTime === '') {
								alert('時間帯を選択してください！');
								return;
							}
							handleNextScreen();
						}}
						type="button"
						class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
					>
						次へ
					</button>
				</div>
			</div>
			<!-- 예약 작성 4번 화면 -->
		{:else if requiredData.screenNumber === 4}
			<div class="flex flex-col justify-center items-center gap-4">
				<div class="relative w-full">
					<label for="password" class="absolute left-3 top-2 font-base text-black text-sm">
						パスワード
					</label>
					<input
						bind:value={reservationData.password}
						name="password"
						required
						type="password"
						class="tracking-[5px] hover:border-slate-400 rounded-md transition bg-white border border-slate-300 focus:border-blue-600 w-full outline-none pt-9 pb-3 px-3 text-lg font-bold"
					/>
				</div>
				<div class="flex gap-3 w-full">
					<button
						on:click={() => {
							handleBeforeScreen();
						}}
						type="button"
						class="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-5 rounded-md"
					>
						前へ
					</button>
					<button
						on:click={() => {
							if (reservationData.password === '') {
								alert('パスワードを入力してください！');
								return;
							}
							handleNextScreen();
						}}
						type="button"
						class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
					>
						次へ
					</button>
				</div>
			</div>
			<!-- 예약 작성 5번 화면 -->
		{:else if requiredData.screenNumber === 5}
			<div class="flex flex-col justify-center items-center gap-4 w-full">
				<p class="text-2xl font-black">予約内容確認</p>
				<div class="flex flex-col gap-3 w-full">
					<div class="flex flex-col gap-1 w-full border border-slate-400 rounded-md py-2 px-3">
						<p class="font-medium text-sm">名前 / バンド名</p>
						<p class="font-bold text-xl text-blue-500">{reservationData.name}</p>
					</div>
					<div class="flex flex-col gap-1 w-full border border-slate-400 rounded-md py-2 px-3">
						<p class="font-medium text-sm">日付</p>
						<p class="font-bold text-xl text-blue-500">{reservationData.selectedDate}</p>
					</div>
					<div class="flex flex-col gap-1 w-full border border-slate-400 rounded-md py-2 px-3">
						<p class="font-medium text-sm">時間帯</p>
						<p class="font-bold text-xl text-blue-500">{reservationData.selectedTime}</p>
					</div>
				</div>
				<div class="flex flex-col gap-3 w-full">
					<button
						type="submit"
						class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
					>
						提出
					</button>
					<button
						on:click={() => {
							handleBeforeScreen();
						}}
						type="button"
						class="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-5 rounded-md"
					>
						前へ
					</button>
				</div>
			</div>
		{/if}
	</form>
</div>