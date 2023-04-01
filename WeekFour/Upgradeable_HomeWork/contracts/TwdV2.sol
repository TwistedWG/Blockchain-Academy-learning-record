// SPDX-License-Identifier: MIT
// TwistedW Token Solidity by TwistedW

pragma solidity ^0.8.4;

import "./IERC20.sol";

contract TwdV2 is IERC20 {
    using SafeMath for uint256;

    string  public  name;
    string  public  symbol;
    uint8   public  decimals;
    bool public initialized;
    uint256 public  totalSupply_;
    uint256 public  value;
    address public  owner_;
    uint256 public constant VERSION = 2;

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    mapping(address => bool) public alreadyMinted;

    modifier initializer() {
        require(!initialized, "Only initialize once");
        _;
        initialized = true;
    }


    function init(uint256 _initValue) public initializer{
        name = "TwistedW";
        symbol = "TWD";
        decimals = 18;
        totalSupply_ = 100000000 * 10**18;     // total tokens would equal (totalSupply_/10**decimals)
        balances[msg.sender] = totalSupply_;
        owner_ = msg.sender;
        value = _initValue;
        emit Transfer(address(0), msg.sender, totalSupply_);
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(
            msg.sender == address(0) || receiver == address(0),
            "Transfer not allowed"
        );
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    // @dev 铸造代币，从 `0` 地址转账给 调用者地址
    function mint(uint amount) external {
        require(!alreadyMinted[msg.sender], "Already minted");
        require(owner_==msg.sender, "Ownable: caller is not the owner");
        balances[msg.sender] += amount;
        totalSupply_ += amount;
        alreadyMinted[msg.sender] = true;
        emit Transfer(address(0), msg.sender, amount);
    }

    // @dev 销毁代币，从 调用者地址 转账给  `0` 地址
    function burn(uint amount) external {
        balances[msg.sender] -= amount;
        totalSupply_ -= amount;
        delete alreadyMinted[msg.sender];
        emit Transfer(msg.sender, address(0), amount);
    }

    function setValue(uint256 _newvalue) external {
        // version 2 take mul method
        value = _newvalue * 20;
    }

    function getValue() public view returns(uint256) {
        return value;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}