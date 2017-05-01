#ifndef MINERUTILE_HPP
# define MINERUTILE_HPP


#include <string>
#include <vector>

class MinerUtile {
protected:
  static std::vector<uint32_t> hex_to_uint32_array(std::string const &hex);
  static std::string           uint32_array_to_hex(std::vector<uint32_t> arr);
  static std::string           byte_to_hex(uint32_t byte);
  static uint32_t              reverseBytesInWord(uint32_t word);
  static std::vector<uint32_t> reverseBytesInWords(std::vector<uint32_t> words);
public:
  static std::vector<uint32_t> fromPoolString(std::string const &hex);
  static std::string           toPoolString(std::vector<uint32_t> words);
};

#endif //!MINER_HPP
