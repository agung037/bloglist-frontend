import { useState, forwardRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"

const Togglable = forwardRef((props, ref) => {
  // state yang berisi true / false
  // untuk menyimpan status terbuka atau tidaknya form
  const [visible, setVisible] = useState(false)

  // menyembunyikan dan menampilkan menggunakan css
  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  // fungsi yang digunakan untuk mengubah state dari form antara true / false
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // variable yang akan dapat dipakai sebagai referensi di komponen lain
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      {/* apabila status form visible maka sembunyikan tombol ini */}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>

      {/* apabila status form visible maka tampilkan tombol ini */}
      <div style={showWhenVisible}>
        {/* clildren adalah turunan dari component yaitu form new blog */}
        {props.children}

        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
