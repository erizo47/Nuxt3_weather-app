<template>
  <div
  class="h-screen relative overflow-hidden"
  >
    <img :src="background" alt="background">
    <div class="absolute w-full h-full top-0 overlay" />
    <div class="absolute w-full h-full top-0 p-48">
      <div class="flex justify-between">
        <div>
          <h1 class="text-7xl text-white">{{ city.name }}</h1>
          <p class="font-extralight text-2xl mt-2 text-white">{{ time.time_24 }}</p>
          <img class="w-56 icon" :src="`https://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`" alt="">
        </div>
        <div>
          <p class="text-8xl text-white font-thin">{{ city.main.temp }}°</p>
        </div>
      </div>
      <div class="flex"></div>
      <form class="mt-20 flex justify-center" @submit.prevent="searchCity">
        <input type="text" name="city" placeholder="Search a city..." class="rounded-md w-1/2 h-10 mr-4" v-model="input" @input="findError = false">
        <button class="bg-sky-400 w-20 text-white h-10 rounded-md">Search</button>
      </form>
      <h3 v-if="findError" class="flex justify-center text-1xl text-white font-medium">Upps, we can`t find this city, please try another one</h3>
    </div>

  </div>
</template>
<script setup lang="ts">
const cookieCity = useCookie("city");
const cookieLat = useCookie('lat')
const cookieLon = useCookie('lon')

const config = useRuntimeConfig();
if (!cookieCity.value) cookieCity.value = "New+York";
if (!cookieLat.value) cookieLat.value = '40.7143';
if (!cookieLon.value) cookieLon.value = '-74.006';

const search = ref(cookieCity.value)
const input = ref('')
const background = ref('')
const lat = ref(cookieLat);
const lon = ref(cookieLon);
const findError = ref(false);
// const {data: city, error} = <any> await useFetch(() => `https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=53dc478603fcebf7b00bcf17075a45f1`);

  
const {data:city} = useAsyncData('city', async () => {
  try {
    const response: any = await $fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}`, {
    params: {
      units: "metric",
      appid: '53dc478603fcebf7b00bcf17075a45f1',
    }
  })
  findError.value = false;
  cookieLat.value = response.coord.lat;
  cookieLon.value = response.coord.lon;
  cookieCity.value = search.value;

  const temp = response.main.temp;
      if (temp <= -10) {
        background.value =
          "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3540&q=80";
      } else if (temp > -10 && temp <= 10) {
        background.value =
          "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3540&q=80";
      } else if (temp > 10 && temp <= 20) {
        background.value =
          "https://images.unsplash.com/photo-1560258018-c7db7645254e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4032&q=80";
      } else {
        background.value =
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3546&q=80";
      }

  return response;
  } catch (error) {
    findError.value = true
  }
  
}, {
  watch: [search]
});

const {data: time} = useAsyncData('time', async () => {
  const response: any = await $fetch(`https://api.ipgeolocation.io/timezone?lat=${lat.value}&long=${lon.value}`, {
    params: {
      apiKey: '9ab6f1b144f2450ab968b5a6fad5b3d5',
    }
  })
  return response
}, {watch: [lon]} )



const searchCity = () => {
  const formatedInput = input.value.trim().split(' ').join('+');
  search.value = formatedInput;
  input.value = "";
}
</script>
<style scoped>
.overlay {
  background-color: rgba(0,0, 0, .5);
}
</style>