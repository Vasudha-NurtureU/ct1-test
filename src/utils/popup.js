
export function togglePopup(that, modalOption , cb) {
  that.setState({
    [modalOption.name]: {
      ...that.state[modalOption.name],
      ...modalOption.props
    }
  },cb)
}

export function toggleConfirmPopup(that, confirmOption) {
  that.setState({
    [confirmOption.name]: {
      ...that.state[confirmOption.name],
      ...confirmOption.props
    }
  })
}

export function show(that) {
  that.toast.current.show(this.state.toastMessage);
}
