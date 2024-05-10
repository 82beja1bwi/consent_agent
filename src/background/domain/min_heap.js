/**
 * Copy of MinHeap algorithm in JS by GeeksForGeeks
 * https://www.geeksforgeeks.org/min-heap-in-javascript/?ref=ml_lbp
 *
 * Relevant modifications:
 *  - allow limiting of number of elements
 *  - handles {score, contract}
 */
export default class MinHeap {
  constructor (noOfElements) {
    this.noOfElements = noOfElements
    this.heap = []
  }

  getHeap () {
    return this.heap
  }

  // Helper Methods
  getLeftChildIndex (parentIndex) {
    return 2 * parentIndex + 1
  }

  getRightChildIndex (parentIndex) {
    return 2 * parentIndex + 2
  }

  getParentIndex (childIndex) {
    return Math.floor((childIndex - 1) / 2)
  }

  hasLeftChild (index) {
    return this.getLeftChildIndex(index) < this.heap.length
  }

  hasRightChild (index) {
    return this.getRightChildIndex(index) < this.heap.length
  }

  hasParent (index) {
    return this.getParentIndex(index) >= 0
  }

  leftChild (index) {
    return this.heap[this.getLeftChildIndex(index)]
  }

  rightChild (index) {
    return this.heap[this.getRightChildIndex(index)]
  }

  parent (index) {
    return this.heap[this.getParentIndex(index)]
  }

  // Functions to create Min Heap

  swap (indexOne, indexTwo) {
    const temp = this.heap[indexOne]
    this.heap[indexOne] = this.heap[indexTwo]
    this.heap[indexTwo] = temp
  }

  // Modified to
  // - accept {score, Contract} objects
  // - add and potentially remove if over limit of elements
  add ({ score, contract }) {
    if (this.heap.length < this.noOfElements) {
      this.heap.push({ score, contract })
      this.heapifyUp()
    } else if (score > this.heap[0].score) {
      this.heap[0] = { score, contract }
      this.heapifyDown()
    }
  }

  heapifyUp () {
    let index = this.heap.length - 1
    while (
      this.hasParent(index) &&
      this.parent(index).score > this.heap[index].score
    ) {
      this.swap(this.getParentIndex(index), index)
      index = this.getParentIndex(index)
    }
  }

  heapifyDown () {
    let index = 0
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index)
      if (
        this.hasRightChild(index) &&
        this.rightChild(index).score < this.leftChild(index).score
      ) {
        smallerChildIndex = this.getRightChildIndex(index)
      }
      if (this.heap[index].score < this.heap[smallerChildIndex].score) {
        break
      } else {
        this.swap(index, smallerChildIndex)
      }
      index = smallerChildIndex
    }
  }
}
