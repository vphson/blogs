# Feature Specification: Personal Blog for Buddhist Practitioner

**Feature Branch**: `001-personal-blog`
**Created**: 2025-01-07
**Status**: Draft
**Input**: User description: "Blog cá nhân của nhà tu hành Phật giáo - nơi chia sẻ cảm nhận về cuộc sống. Yêu cầu: Framework: Next.js (React), Tính năng chính: 1) Viết & quản lý bài viết, 2) Chia sẻ bài viết theo chủ đề (pháp thoại, thiền, cuộc sống...), 3) Tìm kiếm nội dung, 4) **Độc giả chỉ đọc, không cần đăng nhập, không có bình luận**, Phong cách thiết kế: Tối giản & Zen - mang cảm giác bình an, nhiều khoảng trắng, màu sắc nhẹ nhàng"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Đọc Bài Viết (Priority: P1)

Người truy cập (không cần đăng nhập) có thể đọc các bài viết trên blog, xem danh sách bài viết mới nhất, và xem bài viết theo từng chủ đề.

**Why this priority**: Đây là tính năng cốt lõi của blog - mục đích chính là chia sẻ và truyền cảm hứng. Nếu không có tính năng này, blog không thể hoạt động được.

**Independent Test**: Có thể kiểm tra bằng cách truy cập trang chủ, xem danh sách bài viết, click vào một bài để đọc đầy đủ nội dung. Hoàn toàn độc lập với các tính năng khác.

**Acceptance Scenarios**:

1. **Given** người truy cập vào trang chủ, **When** xem trang, **Then** hiển thị danh sách các bài viết mới nhất với tiêu đề, tóm tắt, ngày đăng, và chủ đề
2. **Given** người truy cập, **When** click vào một bài viết, **Then** hiển thị đầy đủ nội dung bài viết với định dạng rõ ràng, dễ đọc
3. **Given** người truy cập, **When** chọn một chủ đề (ví dụ: "Pháp thoại"), **Then** chỉ hiển thị các bài viết thuộc chủ đề đó
4. **Given** người truy cập, **When** bài viết quá dài, **Then** nội dung được phân trang hoặc có "đọc tiếp" để điều hướng dễ dàng

---

### User Story 2 - Tìm Kiếm Nội Dung (Priority: P2)

Người truy cập có thể tìm kiếm bài viết theo từ khóa trong tiêu đề và nội dung.

**Why this priority**: Giúp độc giả nhanh chóng tìm thấy nội dung họ quan tâm, nâng cao trải nghiệm người dùng. Tuy nhiên, blog vẫn hoạt động tốt mà không có nó thông qua việc xem theo chủ đề.

**Independent Test**: Có thể kiểm tra độc lập bằng cách nhập từ khóa và xem kết quả tìm kiếm. Không phụ thuộc vào các tính năng khác.

**Acceptance Scenarios**:

1. **Given** người truy cập ở bất kỳ trang nào, **When** nhập từ khóa vào ô tìm kiếm, **Then** hiển thị danh sách bài viết khớp với từ khóa
2. **Given** người truy cập, **When** tìm kiếm với từ khóa không có kết quả, **Then** hiển thị thông báo "Không tìm thấy bài viết nào" một cách nhẹ nhàng
3. **Given** người truy cập, **When** tìm kiếm, **Then** kết quả được sắp xếp theo độ liên quan
4. **Given** người truy cập, **When** click vào kết quả tìm kiếm, **Then** chuyển hướng đến bài viết tương ứng

---

### User Story 3 - Viết & Quản Lý Bài Viết (Priority: P1)

Người viết (nhà tu hành) có thể đăng nhập vào giao diện quản trị, tạo bài viết mới, chỉnh sửa bài viết cũ, và xóa bài viết không còn muốn giữ lại.

**Why this priority**: Đây là tính năng quan trọng nhất để duy trì blog - không có cách nào thêm nội dung mới. Nhà tu hành cần một cách dễ dàng để chia sẻ suy nghĩ của mình.

**Independent Test**: Có thể kiểm tra độc lập bằng cách đăng nhập vào admin, tạo một bài viết, xem nó xuất hiện trên trang blog. Không phụ thuộc vào bình luận hay chia sẻ.

**Acceptance Scenarios**:

1. **Given** người viết đã đăng nhập, **When** click "Tạo bài viết mới", **Then** mở trình soạn thảo với các trường: tiêu đề, nội dung, chủ đề, hình ảnh (tùy chọn)
2. **Given** người viết đang soạn thảo, **When** nhập nội dung và chọn "Xuất bản", **Then** bài viết được lưu và hiển thị trên blog
3. **Given** người viết đã đăng nhập, **When** xem danh sách bài viết, **Then** có thể chỉnh sửa hoặc xóa từng bài
4. **Given** người viết đang soạn thảo, **When** chọn "Lưu nháp", **Then** bài viết được lưu nhưng không hiển thị trên blog
5. **Given** người viết, **When** xóa một bài viết, **Then** bài viết bị xóa và không còn xuất hiện trên blog

---

### User Story 4 - Phân Loại Theo Chủ Đề (Priority: P2)

Người viết có thể gán chủ đề cho bài viết (Pháp thoại, Thiền, Cuộc sống, Sự việc...). Người truy cập có thể lọc bài viết theo chủ đề.

**Why this priority**: Giúp tổ chức nội dung một cách có cấu trúc, giúp độc giả dễ dàng tìm thấy nội dung họ quan tâm. Tuy nhiên, blog vẫn hoạt động mà không có nó.

**Independent Test**: Có thể kiểm tra bằng cách tạo bài với chủ đề, sau đó lọc theo chủ đề đó và xem kết quả.

**Acceptance Scenarios**:

1. **Given** người viết, **When** tạo/sửa bài viết, **Then** có thể chọn một hoặc nhiều chủ đề từ danh sách có sẵn
2. **Given** người truy cập, **When** click vào tên chủ đề, **Then** chỉ hiển thị các bài viết thuộc chủ đề đó
3. **Given** người truy cập, **When** xem một bài viết, **Then** thấy các chủ đề của bài đó được hiển thị
4. **Given** người truy cập, **When** xem trang chủ, **Then** thấy danh sách các chủ đề với số lượng bài viết mỗi chủ đề

---

### User Story 5 - Thiết Kế Tối Giản & Zen (Priority: P1)

Giao diện blog mang cảm giác bình an, nhiều khoảng trắng, màu sắc nhẹ nhàng, phù hợp với tinh thần thiền.

**Why this priority**: Đây là tính năng quan trọng để tạo trải nghiệm đúng với tinh thần blog. Giao diện là thứ người truy cập thấy đầu tiên và ảnh hưởng đến cảm giác của họ.

**Independent Test**: Có thể kiểm tra độc lập bằng cách xem giao diện blog và đánh giá cảm giác mang lại.

**Acceptance Scenarios**:

1. **Given** người truy cập, **When** xem bất kỳ trang nào, **Then** cảm thấy giao diện nhẹ nhàng, không rối mắt, có nhiều khoảng trắng
2. **Given** người truy cập, **When** đọc bài viết, **Then** font chữ rõ ràng, kích thước phù hợp, khoảng dòng thoải mái để đọc lâu
3. **Given** người truy cập, **When** xem blog, **Then** màu sắc nhẹ nhàng (trắng, be, xanh lá nhạt, vàng nhat...)
4. **Given** người truy cập, **When** điều hướng trên blog, **Then** chuyển động mượt mà, không đột ngột
5. **Given** người truy cập trên điện thoại, **When** xem blog, **Then** giao diện responsive, dễ đọc trên màn hình nhỏ

---

### Edge Cases

- **Khi không có bài viết**: Trang chủ hiển thị thông báo nhẹ nhàng "Chưa có bài viết nào. Hãy quay lại sau nhé!"
- **Khi tìm kiếm không có kết quả**: Hiển thị thông báo "Không tìm thấy bài viết nào phù hợp. Bạn có thể thử từ khóa khác"
- **Khi hình ảnh không tải được**: Hiển thị placeholder hoặc alt text một cách trang trọng
- **Khi admin quên mật khẩu**: Có thể đặt lại mật khẩu qua email (Supabase Auth)
- **Khi admin đang edit bài**: Chỉ có 1 admin nên không cần xử lý conflict

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST cho phép người truy cập xem danh sách bài viết mà không cần đăng nhập
- **FR-002**: System MUST hiển thị đầy đủ nội dung bài viết khi người truy cập click vào
- **FR-003**: System MUST cho phép người viết đăng nhập vào giao diện quản trị
- **FR-004**: System MUST cho phép người viết tạo bài viết mới với tiêu đề, nội dung, và chủ đề
- **FR-005**: System MUST cho phép người viết chỉnh sửa và xóa bài viết
- **FR-006**: System MUST cho phép người viết lưu bài viết dưới dạng nháp
- **FR-007**: System MUST cho phép người truy cập tìm kiếm bài viết theo từ khóa
- **FR-008**: System MUST cho phép người viết gán chủ đề cho bài viết
- **FR-009**: System MUST cho phép người truy cập lọc bài viết theo chủ đề
- **FR-010**: System MUST responsive trên mọi kích thước màn hình (desktop, tablet, mobile)
- **FR-011**: System MUST sử dụng font chữ dễ đọc, hỗ trợ tiếng Việt
- **FR-012**: System MUST hiển thị màu sắc nhẹ nhàng, phù hợp tinh thần thiền
- **FR-013**: System MUST có nhiều khoảng trắng để tạo cảm giác bình an
- **FR-014**: System MUST tự động lưu nháp định kỳ để tránh mất nội dung
- **FR-015**: System MUST hỗ trợ upload hình ảnh cho bài viết
- **FR-016**: System MUST hiển thị thông báo lỗi một cách nhẹ nhàng, thân thiện

### Key Entities

- **Bài viết (Post)**: Đại diện cho một bài viết blog, bao gồm tiêu đề, nội dung, tóm tắt, ngày tạo, ngày cập nhật, trạng thái (nháp/xuất bản), hình ảnh đại diện
- **Chủ đề (Category)**: Đại diện cho một phân loại nội dung (Pháp thoại, Thiền, Cuộc sống, Sự việc...), mỗi bài viết có thể có nhiều chủ đề
- **Admin (Quản trị viên)**: Người viết blog (nhà tu hành), được quản lý bởi Supabase Auth (không cần custom User model)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người truy cập có thể tìm và đọc một bài viết trong dưới 30 giây kể từ khi vào trang
- **SC-002**: Người viết có thể tạo và xuất bản một bài viết mới trong dưới 5 phút
- **SC-003**: Tìm kiếm trả về kết quả trong dưới 2 giây với 1000 bài viết
- **SC-004**: Blog có thể xử lý 1000 người truy cập đồng thời mà không bị chậm
- **SC-005**: 95% người truy cập có thể tìm thấy nội dung họ tìm kiếm trong lần thử đầu tiên
- **SC-006**: Giao diện đạt điểm 90/100 về accessibility (WCAG AA)
- **SC-007**: Blog tải hoàn toàn trong dưới 3 giây trên kết nối 3G
- **SC-008**: Độ readable của nội dung đạt 8/10 theo tiêu chuẩn Flesch Reading Ease cho tiếng Việt

## Assumptions

- Người viết là một người duy nhất (admin) - không cần hệ thống multi-user phức tạp
- **Độc giả (public users) KHÔNG cần đăng nhập, chỉ đọc blog**
- **Không có tính năng bình luận hay tương tác xã hội**
- Blog sẽ được lưu trữ trên một dịch vụ cloud (Vercel, Supabase)
- Không cần hệ thống notification phức tạp
- Hình ảnh được lưu trữ trên dịch vụ CDN hoặc cloud storage (Supabase Storage)
- Không cần tính năng phân tích/analytic phức tạp trong giai đoạn đầu
- Ngôn ngữ chính là tiếng Việt
- Không cần hỗ trợ multi-language trong giai đoạn đầu
- Blog không cần tính năng bán hàng hay donate trong giai đoạn đầu
- **Sử dụng Supabase cho Auth, Database, và Storage**