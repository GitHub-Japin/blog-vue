<template>
<!--	<div style="font-size: 60px;margin-top:100px;text-align: center;">-->
  <div>
    <ServerInfo></ServerInfo>
		<span style="font-size: 60px;margin-top:100px;">
			欢迎进入博客后台
		</span>
	</div>
</template>

<script>
	import ServerInfo from "../../components/server/ServerInfo";

  export default {
		name: "Welcome",
    components: { ServerInfo },
		data() {
			return {
				userId: ""
			}
		}
	}
</script>
