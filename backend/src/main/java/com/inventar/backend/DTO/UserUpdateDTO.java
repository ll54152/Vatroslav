package com.inventar.backend.DTO;

public class UserUpdateDTO {

    private String email;
    private String firstName;
    private String lastName;
    private String oldPassword;
    private String newPassword;

    public UserUpdateDTO(String email, String firstName, String lastName, String oldPassword, String newPassword) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public UserUpdateDTO() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
