// Import the MinHeap class
import MinHeap from '../../../src/background/domain/min_heap'
import Contract from '../../../src/background/domain/models/contract'

// Define the test cases
describe('MinHeap', () => {
  it('three best scores for list of scores', () => {
    const heap = new MinHeap(3)
    const scores = [
      { score: 2256, contract: new Contract() },
      { score: 3096, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 4356, contract: new Contract() },
      { score: 3444, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 5000, contract: new Contract() },
      { score: 6000, contract: new Contract() }
    ]
    scores.forEach((score) => heap.add(score))
    expect(heap.getHeap()).toEqual([
      { score: 4356, contract: new Contract() },
      { score: 6000, contract: new Contract() },
      { score: 5000, contract: new Contract() }
    ])
  })
  it('three best scores for slightly changed list of scores', () => {
    const heap = new MinHeap(3)
    const scores = [
      { score: 6000, contract: new Contract() },
      { score: 2256, contract: new Contract() },
      { score: 3096, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 4356, contract: new Contract() },
      { score: 3444, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 5000, contract: new Contract() }

    ]
    scores.forEach((score) => heap.add(score))
    // expect(heap.getHeap()).toEqual([4356, 6000, 5000])
    expect(
      heap.getHeap()).toEqual([
      { score: 4356, contract: new Contract() },
      { score: 6000, contract: new Contract() },
      { score: 5000, contract: new Contract() }
    ])
  })

  it('three best scores for inverted list of scores', () => {
    const heap = new MinHeap(3)
    const scores = [
      { score: 6000, contract: new Contract() },
      { score: 5000, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 4356, contract: new Contract() },
      { score: 3444, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 3096, contract: new Contract() },
      { score: 2256, contract: new Contract() }
    ]
    scores.forEach((score) => heap.add(score))
    expect(heap.getHeap()).toEqual([
      { score: 4356, contract: new Contract() },
      { score: 6000, contract: new Contract() },
      { score: 5000, contract: new Contract() }
    ])
  })

  it('should correctly maintain the single best score for the fourth set of scores', () => {
    const heap = new MinHeap(1)
    const scores = [
      { score: 2256, contract: new Contract() },
      { score: 3096, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 4356, contract: new Contract() },
      { score: 3444, contract: new Contract() },
      { score: 3996, contract: new Contract() },
      { score: 5000, contract: new Contract() },
      { score: 6000, contract: new Contract() }
    ]
    scores.forEach((score) => heap.add(score))
    expect(heap.getHeap()).toEqual([
      { score: 6000, contract: new Contract() }
    ])
  })
})
