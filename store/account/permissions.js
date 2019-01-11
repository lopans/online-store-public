const permissions = {
  namespaced: true,
  state: () => ({
    roles: [],
    rolePermissions: [],
  }),
  mutations: {
    setRoles(state, data) {
      state.roles = data
    },
    setPermissions(state, data) {
      state.rolePermissions = data
    },
  },
  actions: {
    async getRoles({ commit }) {
      try {
        let { data } = await this.$axios.get('permissions/getRoles')
        if (data && data.length) {
          commit('setRoles', data)
        }
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    async getRolePermissions({ commit }, roleID) {
      try {
        let { data } = await this.$axios.get(
          'permissions/getList?roleID=' + roleID
        )
        if (data) {
          commit('setPermissions', data)
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
}
export default permissions
