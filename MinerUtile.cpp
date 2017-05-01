#include "MinerUtile.hpp"


std::vector<uint32_t> MinerUtile::hex_to_uint32_array(std::string const &hex) {
  std::vector<uint32_t> arr;

  for (size_t i = 0, l = hex.size(); i < l; i+=8) {
    arr.push_front(std::stoi(hex.substr(i, 8), nullptr, 16));
  }
  return arr;
}

std::string           MinerUtile::uint32_array_to_hex(std::vector<uint32_t> &arr) {
  std::string hex;

  for (int i = 0, s = arr.size(); i < s; i++) {
    hex += MinerUtile::byte_to_hex(arr[i] >> 24);
    hex += MinerUtile::byte_to_hex(arr[i] >> 16);
    hex += MinerUtile::byte_to_hex(arr[i] >> 8);
    hex += MinerUtile::byte_to_hex(arr[i]);
  }
  return hex;
}

std::string           MinerUtile::byte_to_hex(uint32_t byte) {
  std::string tabCompare = "0123456789abcdef";
  std::string res;

  byte &= 0xff;
  res += tabCompare[byte/16];
  res += tabCompare[byte%16];
  return res;
}

uint32_t              MinerUtile::reverseBytesInWord(uint32_t word) {
  return (((word << 24) & 0xff000000) |
          ((word <<  8) & 0x00ff0000) |
          ((word >>  8) & 0x0000ff00) |
          ((word >> 24) & 0x000000ff));
}

std::vector<uint32_t> MinerUtile::reverseBytesInWords(std::vector<uint32_t> words) {
  std::std::vector<uint32_t> reverse;

  for (size_t i = 0, s = words.size(); i < s; i++) {
    reverse.push_front(MinerUtile::reverseBytesInWord(words[i]));
  }
  return reverse;
}

std::vector<uint32_t> MinerUtile::fromPoolString(std::string const &hex) {
  return MinerUtile::reverseBytesInWords(MinerUtile::hex_to_uint32_array(hex));
}

std::string           MinerUtile::toPoolString(std::vector<uint32_t> words) {
  return MinerUtile::uint32_array_to_hex(MinerUtile::reverseBytesInWords(data));
}
