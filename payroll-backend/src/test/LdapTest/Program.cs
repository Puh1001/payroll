using System;
using System.Collections.Generic;
using System.DirectoryServices.Protocols;
using System.Net;

namespace LdapTest
{
public class LdapService
{
    private readonly string[] _servers = { "10.0.60.20", "10.0.60.19" }; // Các Domain Controllers
        private readonly string _username = "v250813@bestpacific.com"; // Tên tài khoản người dùng
        private readonly string _password = "bpvn@123$$"; // Mật khẩu người dùng

    // Base DN cho các OU mà bạn muốn truy vấn
        private readonly string _searchBaseBPVN = "DC=bestpacific,DC=com"; // Base DN cho OU=BPVN
        // private readonly string _searchBaseZPVN = "DC=bestpacific,DC=com"; // Base DN cho OU=ZPVN

        // Danh sách các thuộc tính cần lấy
        private readonly string[] _userAttributes = new[]
        {
            "sAMAccountName",    // Tên đăng nhập
            "mail",             // Email
            "displayName",      // Tên hiển thị
            "givenName",        // Tên
            "sn",              // Họ
            "department",       // Phòng ban
            "title",           // Chức vụ
            "company",         // Công ty
            "manager",         // Quản lý
            "memberOf",        // Nhóm thành viên
            "whenCreated",     // Ngày tạo
            "whenChanged",     // Ngày thay đổi
            "description",     // Mô tả
            "telephoneNumber", // Số điện thoại
            "mobile",         // Số di động
            "physicalDeliveryOfficeName", // Văn phòng
            "employeeID",     // Mã nhân viên
            "employeeNumber", // Số nhân viên
            "employeeType",   // Loại nhân viên
            "distinguishedName" // Đường dẫn đầy đủ
        };

        public List<Dictionary<string, string>> GetUsers()
        {
            var result = new List<Dictionary<string, string>>();
        var credential = new NetworkCredential(_username, _password);

        foreach (var server in _servers)
        {
            try
            {
                Console.WriteLine($"Đang kết nối tới server {server}...");

                    using (var connection = new LdapConnection(new LdapDirectoryIdentifier(server, 389)))
                {
                        connection.Credential = credential;
                        connection.AuthType = AuthType.Basic;

                        // Cấu hình LDAP v3
                        connection.SessionOptions.ProtocolVersion = 3;

                        connection.Bind();
                Console.WriteLine($"Kết nối thành công với server {server}");

                        // Truy vấn thông tin người dùng từ OU=BPVN với phân trang
                        var pageSize = 1000;
                        var pageRequest = new PageResultRequestControl(pageSize);
                        var searchRequest = new SearchRequest(
                    _searchBaseBPVN, 
                            "(&(objectClass=user)(objectCategory=person)(sAMAccountName=V25081312))",
                    SearchScope.Subtree, 
                            null // Để null để lấy tất cả các thuộc tính
                        );
                        searchRequest.Controls.Add(pageRequest);

                        while (true)
                        {
                            var searchResponse = (SearchResponse)connection.SendRequest(searchRequest);
                            ProcessSearchResults(searchResponse.Entries, result);
                            Console.WriteLine($"Đã lấy {result.Count} users...");

                            // Kiểm tra xem còn trang tiếp theo không
                            var pageResponse = (PageResultResponseControl)searchResponse.Controls[0];
                            if (pageResponse.Cookie.Length == 0)
                                break;

                            // Cập nhật cookie cho lần tìm kiếm tiếp theo
                            pageRequest.Cookie = pageResponse.Cookie;
                        }

                        Console.WriteLine($"Tìm thấy tổng cộng {result.Count} users trong BPVN");
                    }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi kết nối tới server {server}: {ex.Message}");
            }
        }

        return result;
        }

        private void ProcessSearchResults(SearchResultEntryCollection entries, List<Dictionary<string, string>> result)
        {
            foreach (SearchResultEntry entry in entries)
            {
                var userInfo = new Dictionary<string, string>();
                
                // Lấy tất cả các thuộc tính có sẵn
                foreach (string attrName in entry.Attributes.AttributeNames)
                {
                    var values = entry.Attributes[attrName];
                    if (values.Count > 0)
                    {
                        // Xử lý các thuộc tính có nhiều giá trị
                        if (values.Count > 1)
                        {
                            var allValues = new List<string>();
                            for (int i = 0; i < values.Count; i++)
                            {
                                allValues.Add(values[i].ToString());
                            }
                            userInfo[attrName] = string.Join("; ", allValues);
                        }
                        else
                        {
                            userInfo[attrName] = values[0].ToString();
                        }
                    }
                }
                
                result.Add(userInfo);
            }
        }
    }

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("🚀 Bắt đầu test đăng nhập LDAP...");
        
        var ldapService = new LdapService();
        var users = ldapService.GetUsers();

        Console.WriteLine("\n📊 Danh sách users tìm thấy:");
        Console.WriteLine("----------------------------------------");
        
            foreach (var user in users)
            {
                // Hiển thị thông tin cơ bản nếu có
                Console.WriteLine($"Username: {GetValueOrDefault(user, "sAMAccountName")}");
                Console.WriteLine($"Email: {GetValueOrDefault(user, "mail")}");
                Console.WriteLine($"Tên hiển thị: {GetValueOrDefault(user, "displayName")}");
                Console.WriteLine($"Họ và tên: {GetValueOrDefault(user, "sn")} {GetValueOrDefault(user, "givenName")}");
                Console.WriteLine($"Phòng ban: {GetValueOrDefault(user, "department")}");
                Console.WriteLine($"Chức vụ: {GetValueOrDefault(user, "title")}");
                Console.WriteLine($"Công ty: {GetValueOrDefault(user, "company")}");
                Console.WriteLine($"Quản lý: {GetValueOrDefault(user, "manager")}");
                Console.WriteLine($"Nhóm thành viên: {GetValueOrDefault(user, "memberOf")}");
                Console.WriteLine($"Ngày tạo: {GetValueOrDefault(user, "whenCreated")}");
                Console.WriteLine($"Ngày thay đổi: {GetValueOrDefault(user, "whenChanged")}");
                Console.WriteLine($"Mô tả: {GetValueOrDefault(user, "description")}");
                Console.WriteLine($"Số điện thoại: {GetValueOrDefault(user, "telephoneNumber")}");
                Console.WriteLine($"Số di động: {GetValueOrDefault(user, "mobile")}");
                Console.WriteLine($"Văn phòng: {GetValueOrDefault(user, "physicalDeliveryOfficeName")}");
                Console.WriteLine($"Mã nhân viên: {GetValueOrDefault(user, "employeeID")}");
                Console.WriteLine($"Số nhân viên: {GetValueOrDefault(user, "employeeNumber")}");
                Console.WriteLine($"Loại nhân viên: {GetValueOrDefault(user, "employeeType")}");
                Console.WriteLine($"Đường dẫn: {GetValueOrDefault(user, "distinguishedName")}");
                
                // Hiển thị tất cả các thuộc tính khác
                Console.WriteLine("\nCác thuộc tính khác:");
                foreach (var attr in user)
                {
                    if (!new[] { "sAMAccountName", "mail", "displayName", "sn", "givenName", "department", 
                               "title", "company", "manager", "memberOf", "whenCreated", "whenChanged", 
                               "description", "telephoneNumber", "mobile", "physicalDeliveryOfficeName", 
                               "employeeID", "employeeNumber", "employeeType", "distinguishedName" }.Contains(attr.Key))
                    {
                        Console.WriteLine($"{attr.Key}: {attr.Value}");
                    }
                }
            Console.WriteLine("----------------------------------------");
        }

        Console.WriteLine($"\n✅ Tổng số users tìm thấy: {users.Count}");
            Console.WriteLine("\nNhấn phím bất kỳ để thoát...");
            Console.ReadKey();
        }

        private static string GetValueOrDefault(Dictionary<string, string> dict, string key)
        {
            return dict.TryGetValue(key, out string value) ? value : "Không có thông tin";
        }
    }
} 