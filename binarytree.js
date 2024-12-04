class Node {
    constructor(data,left = null,right = null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}

class Tree {
  constructor(array) {
    this.root = buildTree(removeDuplicates(array));
  }
  // Inorder traversal with a callback (left,root,right)
  inOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }
    function traverse(node) {
      if (node !== null) {
        traverse(node.left);
        callback(node);
        traverse(node.right);
      }
    }
    traverse(this.root);
  }
  // Preorder traversal with a callback (root,left,right)
  preOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }
    function traverse(node) {
      if (node !== null) {
        callback(node);
        traverse(node.left);
        traverse(node.right)
      }
    }
    traverse(this.root);
  }
  // Postorder traversal with a callback (left,right,root)
  postOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }
    function traverse(node) {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        callback(node)
      }
    }
    traverse(this.root);
  }
  // calculates the height of a given node
  height(node) {
    // base case
    if (node === null) {
      return -1;
    }
    // recursively calculates the height of the left subtree
    let leftHeight = this.height(node.left);
    // recursively calculates the height of the right subtree
    let rightHeight = this.height(node.right);
    // picks the greater height and adds one to the height because of the node itself
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(root, node) {
    if (root === null) {
      return -1;
    }
    // If the current node is the target node, the depth is 0
    if (root === node) {
      return 0;
    }
    // Recursively search for the target node in the left subtree
    let leftDepth = this.depth(root.left, node);
    if (leftDepth !== -1) {
      return leftDepth + 1; // If the target node is found in the left subtree
    }
    // Recursively search for the target node in the right subtree
    let rightDepth = this.depth(root.right, node);
    if (rightDepth !== -1) {
      return rightDepth + 1; // If the target node is found in the right subtree
    }
    // If the node is not found in either subtree
    return -1;
  }

  isBalanced(root = this.root) {
    // Base case: A null node is balanced and has height -1
    if (root === null) {
      return { balanced: true, height: -1 };
    }
  
    // Check if left subtree is balanced and get its height
    const left = this.isBalanced(root.left);
    if (!left.balanced) return { balanced: false };
  
    // Check if right subtree is balanced and get its height
    const right = this.isBalanced(root.right);
    if (!right.balanced) return { balanced: false };
  
    // Check if current node is balanced
    const balanced = Math.abs(left.height - right.height) <= 1;
    const height = Math.max(left.height, right.height) + 1;
  
    return { balanced, height };
  }

  rebalance() {
    // Step 1: Check if the tree is already balanced
    if (this.isBalanced().balanced) {
      console.log("Tree is already balanced.");
      return; // No need to rebalance
    }
  
    // Step 2: Collect all node values in a sorted array using inOrder traversal
    const nodesArray = [];
    this.inOrder((node) => nodesArray.push(node.data));
  
    // Step 3: Build a balanced tree from the sorted array of nodes
    this.root = buildTree(nodesArray);
  }
  insert(value) {
    //checks to see if there's a tree/root node, if not a root node is created 
    if (this.root === null) {
      this.root = new Node(value);
    }
  
    let current = this.root;
  
    //traverses the binary tree to see if there's an open spot to create a node
    while(true) {
      if (value < current.data) {
        if (current.left === null) {
          current.left = new Node(value);
          return;
        }
        else {
          current = current.left;
        }
      }
      else {
        if (value > current.data) {
          if (current.right === null) {
            current.right = new Node(value);
            return;
          }
          else {
            current = current.right;
          }
        }
      }
    }
  }

// finds a given value
  find(value) {
    let current = this.root;
    while(current !== null) {
      if (value > current.data) {
        current = current.right;
      }
      else if (value < current.data) {
        current = current.left;
      } 
      else {
        return current;
      }
    }
    return null;
  }
}

function removeDuplicates(array) {
    // Using Set to remove duplicates
    return [...new Set(array)];
}

function buildTree(array) {
    array.sort((a, b) => a - b);
    if (array.length === 0) {
        return null;
    }
    const mid = Math.floor(array.length / 2);
    let rootNode = new Node(array[mid]);
    rootNode.left = buildTree(array.slice(0, mid));
    rootNode.right = buildTree(array.slice(mid + 1));

    return rootNode;
}

// Finds the inorder successor to replace the current node
function getSuccessor(current) {
  current = current.right;
  while (current !== null && current.left !== null) {
    current = current.left;
  }
  return current;
}

function deleteItem(current, value) {
  // Base Case
  if (current === null) {
    return null;
  }
  // Traverse to the right subtree if the value is greater than the current node's data
  if (value > current.data) {
    current.right = deleteItem(current.right, value);

  // Traverse to the left subtree if the value is less than the current node's data
  } else if (value < current.data){
    current.left = deleteItem(current.left, value);
  }
  // The value matches the current node, proceed to delete it
  else {
    // Case 1: Node has no left child
    if (current.left === null) {
      return current.right; // Replace current node with its right child
    }
    // Case 2: Node has no right child
    if (current.right === null) {
      return current.left; // Replace current node with its left child
    }
    // Case 3: Node has two children
    let successor = getSuccessor(current);
    current.data = successor.data; // Replace current node's value with in-order successor's value
    current.right = deleteItem(current.right, successor.data); // Delete the in-order successor
  }
  return current; // Return the updated current node
}

function levelOrder(callback) {
  if (typeof callback !== 'function') {
    throw new Error('A callback function is required');
  }
  if (this.root === null) {
    return;
  }
  // initializes the queue with the root node
  let queue = [this.root]
  // continuously loops while there are elements in the queue
  while (queue.length > 0) {
    // replaces and removes the first element in the queue
    let currentNode = queue.shift();
    callback(currentNode);
    // pushes left child of the current node to the queue
    if (currentNode.left !== null) {
      queue.push(currentNode.left);
    }
    // pushes the right child of the current node to the queue
    if (currentNode.right !== null) {
      queue.push(currentNode.right)
    }
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

// Driver code to test the functionality of the Tree class and its methods

// Sample data to initialize the tree
let array = [10, 5, 20, 3, 7, 15, 25, 2, 6, 17];
let tree = new Tree(array);

// Pretty print the initial balanced tree
console.log("Initial balanced tree:");
prettyPrint(tree.root);

// Test insertion
console.log("\nInserting values 1 and 18:");
tree.insert(1);
tree.insert(18);
prettyPrint(tree.root);

// Test if the tree is balanced
console.log("\nIs the tree balanced?");
console.log(tree.isBalanced().balanced); // Expected: true or false depending on balance

// Test traversal methods
// In-order traversal: Print node values
console.log("\nIn-order traversal:");
let inOrderValues = [];
tree.inOrder((node) => inOrderValues.push(node.data));
console.log(inOrderValues.join(" ")); // Expected output: nodes in sorted order

// Pre-order traversal: Print node values
console.log("\nPre-order traversal:");
let preOrderValues = [];
tree.preOrder((node) => preOrderValues.push(node.data));
console.log(preOrderValues.join(" ")); // Expected output: root first, then left, then right

// Post-order traversal: Print node values
console.log("\nPost-order traversal:");
let postOrderValues = [];
tree.postOrder((node) => postOrderValues.push(node.data));
console.log(postOrderValues.join(" ")); // Expected output: left, right, root

// Level-order traversal: Print node values
console.log("\nLevel-order traversal:");
let levelOrderValues = [];
levelOrder.call(tree, (node) => levelOrderValues.push(node.data));
console.log(levelOrderValues.join(" ")); // Expected output: nodes level by level

// Test height of the tree
console.log("\n\nHeight of the root node:");
console.log(tree.height(tree.root)); // Expected: Height of the entire tree

// Test find method
console.log("\nFinding node with value 15:");
let foundNode = tree.find(15);
console.log(foundNode ? `Found: ${foundNode.data}` : "Not found"); // Expected: Found: 15

// Test deletion
console.log("\nDeleting value 10 (root node):");
tree.root = deleteItem(tree.root, 10);
prettyPrint(tree.root);

// Check balance status after deletion
console.log("\nIs the tree balanced after deletion?");
console.log(tree.isBalanced().balanced); // Expected: true or false depending on balance

// Test rebalancing the tree if it's unbalanced
console.log("\nRebalancing the tree if needed:");
tree.rebalance();
prettyPrint(tree.root);

// Check balance status after rebalancing
console.log("\nIs the tree balanced after rebalancing?");
console.log(tree.isBalanced().balanced); // Expected: true

